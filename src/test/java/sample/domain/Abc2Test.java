package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc2Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc2.class);
        Abc2 abc21 = new Abc2();
        abc21.setId(1L);
        Abc2 abc22 = new Abc2();
        abc22.setId(abc21.getId());
        assertThat(abc21).isEqualTo(abc22);
        abc22.setId(2L);
        assertThat(abc21).isNotEqualTo(abc22);
        abc21.setId(null);
        assertThat(abc21).isNotEqualTo(abc22);
    }
}
