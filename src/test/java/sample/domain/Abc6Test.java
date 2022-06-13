package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc6Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc6.class);
        Abc6 abc61 = new Abc6();
        abc61.setId(1L);
        Abc6 abc62 = new Abc6();
        abc62.setId(abc61.getId());
        assertThat(abc61).isEqualTo(abc62);
        abc62.setId(2L);
        assertThat(abc61).isNotEqualTo(abc62);
        abc61.setId(null);
        assertThat(abc61).isNotEqualTo(abc62);
    }
}
