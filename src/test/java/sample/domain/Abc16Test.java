package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc16Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc16.class);
        Abc16 abc161 = new Abc16();
        abc161.setId(1L);
        Abc16 abc162 = new Abc16();
        abc162.setId(abc161.getId());
        assertThat(abc161).isEqualTo(abc162);
        abc162.setId(2L);
        assertThat(abc161).isNotEqualTo(abc162);
        abc161.setId(null);
        assertThat(abc161).isNotEqualTo(abc162);
    }
}
